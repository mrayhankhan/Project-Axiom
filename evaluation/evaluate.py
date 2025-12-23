"""
Evaluation script for Axiom RAG system.
Tests accuracy, confidence calibration, and performance metrics.
"""
import sys
import json
from pathlib import Path
import numpy as np
from typing import List, Dict

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from rag import get_qa_engine
from config import settings


class EvaluationMetrics:
    """Calculates evaluation metrics for RAG system."""
    
    def __init__(self):
        self.results = []
    
    def evaluate_answer(
        self,
        question_id: str,
        question: str,
        actual_answer: str,
        expected_contains: List[str],
        expected_risk_category: str,
        actual_risk_category: str,
        confidence_score: float,
        expected_min_confidence: float
    ) -> Dict:
        """Evaluate a single answer."""
        
        # Check if expected terms are in answer
        actual_lower = actual_answer.lower()
        contains_matches = [
            term.lower() in actual_lower
            for term in expected_contains
        ]
        
        # Calculate containment score
        containment_score = sum(contains_matches) / len(expected_contains)
        
        # Check risk category
        category_correct = (
            actual_risk_category.lower() == expected_risk_category.lower()
        )
        
        # Check confidence
        confidence_adequate = confidence_score >= expected_min_confidence
        
        # Overall correctness (simple heuristic)
        correct = (
            containment_score >= 0.5 and  # At least half the expected terms
            category_correct
        )
        
        result = {
            "question_id": question_id,
            "question": question,
            "correct": correct,
            "containment_score": containment_score,
            "category_correct": category_correct,
            "confidence_score": confidence_score,
            "confidence_adequate": confidence_adequate,
            "expected_terms_found": sum(contains_matches),
            "expected_terms_total": len(expected_contains)
        }
        
        self.results.append(result)
        return result
    
    def calculate_metrics(self) -> Dict:
        """Calculate aggregate metrics."""
        if not self.results:
            return {}
        
        # Accuracy
        accuracy = sum(r["correct"] for r in self.results) / len(self.results)
        
        # Category accuracy
        category_accuracy = sum(
            r["category_correct"] for r in self.results
        ) / len(self.results)
        
        # Average containment score
        avg_containment = np.mean([r["containment_score"] for r in self.results])
        
        # Average confidence
        avg_confidence = np.mean([r["confidence_score"] for r in self.results])
        
        # Confidence calibration (correct answers should have higher confidence)
        correct_confidences = [
            r["confidence_score"] for r in self.results if r["correct"]
        ]
        incorrect_confidences = [
            r["confidence_score"] for r in self.results if not r["correct"]
        ]
        
        confidence_separation = 0.0
        if correct_confidences and incorrect_confidences:
            confidence_separation = (
                np.mean(correct_confidences) - np.mean(incorrect_confidences)
            )
        
        return {
            "total_questions": len(self.results),
            "accuracy": accuracy,
            "category_accuracy": category_accuracy,
            "avg_containment_score": avg_containment,
            "avg_confidence": avg_confidence,
            "confidence_separation": confidence_separation,
            "correct_avg_confidence": np.mean(correct_confidences) if correct_confidences else 0.0,
            "incorrect_avg_confidence": np.mean(incorrect_confidences) if incorrect_confidences else 0.0
        }


def run_evaluation():
    """Run full evaluation."""
    print("=" * 60)
    print("Axiom RAG System Evaluation")
    print("=" * 60)
    print()
    
    # Load test questions
    test_file = Path(__file__).parent / "test_questions.json"
    with open(test_file, 'r') as f:
        test_questions = json.load(f)
    
    print(f"Loaded {len(test_questions)} test questions")
    print()
    
    # Initialize QA engine
    print("Initializing QA engine...")
    qa_engine = get_qa_engine()
    print("✓ QA engine ready")
    print()
    
    # Initialize metrics
    metrics = EvaluationMetrics()
    
    # Evaluate each question
    print("Running evaluation...")
    print("-" * 60)
    
    for i, test_case in enumerate(test_questions, 1):
        question_id = test_case["id"]
        question = test_case["question"]
        
        print(f"\n[{i}/{len(test_questions)}] {question_id}: {question}")
        
        # Get answer
        try:
            response = qa_engine.answer_question(question, top_k=5)
            
            # Evaluate
            result = metrics.evaluate_answer(
                question_id=question_id,
                question=question,
                actual_answer=response.response.answer,
                expected_contains=test_case["expected_answer_contains"],
                expected_risk_category=test_case["expected_risk_category"],
                actual_risk_category=response.response.risk_category.value,
                confidence_score=response.response.confidence_score,
                expected_min_confidence=test_case["expected_min_confidence"]
            )
            
            # Print result
            status = "✓ PASS" if result["correct"] else "✗ FAIL"
            print(f"  Status: {status}")
            print(f"  Containment: {result['containment_score']:.2f}")
            print(f"  Category: {response.response.risk_category.value} "
                  f"({'✓' if result['category_correct'] else '✗'})")
            print(f"  Confidence: {result['confidence_score']:.2f}")
            print(f"  Terms found: {result['expected_terms_found']}/{result['expected_terms_total']}")
            
        except Exception as e:
            print(f"  ✗ ERROR: {str(e)}")
            # Record as incorrect
            metrics.results.append({
                "question_id": question_id,
                "question": question,
                "correct": False,
                "containment_score": 0.0,
                "category_correct": False,
                "confidence_score": 0.0,
                "confidence_adequate": False,
                "expected_terms_found": 0,
                "expected_terms_total": len(test_case["expected_answer_contains"])
            })
    
    # Calculate and print aggregate metrics
    print()
    print("=" * 60)
    print("Evaluation Results")
    print("=" * 60)
    
    aggregate_metrics = metrics.calculate_metrics()
    
    print(f"\nTotal Questions: {aggregate_metrics['total_questions']}")
    print(f"\n📊 Performance Metrics:")
    print(f"  Accuracy: {aggregate_metrics['accuracy']:.1%}")
    print(f"  Category Accuracy: {aggregate_metrics['category_accuracy']:.1%}")
    print(f"  Avg Containment Score: {aggregate_metrics['avg_containment_score']:.2f}")
    
    print(f"\n🎯 Confidence Metrics:")
    print(f"  Average Confidence: {aggregate_metrics['avg_confidence']:.2f}")
    print(f"  Correct Answers Confidence: {aggregate_metrics['correct_avg_confidence']:.2f}")
    print(f"  Incorrect Answers Confidence: {aggregate_metrics['incorrect_avg_confidence']:.2f}")
    print(f"  Confidence Separation: {aggregate_metrics['confidence_separation']:.2f}")
    
    # Target assessment
    print(f"\n✅ Target Assessment:")
    target_accuracy = 0.80
    if aggregate_metrics['accuracy'] >= target_accuracy:
        print(f"  ✓ Accuracy target met ({target_accuracy:.0%})")
    else:
        print(f"  ✗ Accuracy below target ({target_accuracy:.0%})")
        print(f"    Gap: {(target_accuracy - aggregate_metrics['accuracy']):.1%}")
    
    # Confidence calibration assessment
    if aggregate_metrics['confidence_separation'] > 0.1:
        print(f"  ✓ Good confidence calibration (separation > 0.1)")
    else:
        print(f"  ⚠ Weak confidence calibration")
    
    print()
    print("=" * 60)
    
    # Save detailed results
    results_file = Path(__file__).parent / "evaluation_results.json"
    with open(results_file, 'w') as f:
        json.dump({
            "aggregate_metrics": aggregate_metrics,
            "detailed_results": metrics.results
        }, f, indent=2)
    
    print(f"\n💾 Detailed results saved to: {results_file}")
    print()
    
    return aggregate_metrics


if __name__ == "__main__":
    run_evaluation()
