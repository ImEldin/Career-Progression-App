package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.*;
import com.team5.career_progression_app.service.PromotionRequestService;

import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/promotions")
public class PromotionRequestController {

    private PromotionRequestService promotionRequestService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PromotionRequestDTO>> getPromotionRequestsByUser(@PathVariable Integer userId) {
        List<PromotionRequestDTO> requests = promotionRequestService.getPromotionRequestsByUserId(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ActivePromotionRequestDTO>>> getActivePromotionRequests() {
        List<ActivePromotionRequestDTO> requests = promotionRequestService.getActivePromotionRequests();
        return ResponseEntity.ok(new ApiResponse<>(true, null, requests));
    }

    @GetMapping("/{promotionRequestId}/details")
    public ResponseEntity<ApiResponse<PromotionRequestDetailsDTO>> getPromotionRequestDetails(
        @PathVariable Integer promotionRequestId) {
        PromotionRequestDetailsDTO details = promotionRequestService.getPromotionRequestDetails(promotionRequestId);
        return ResponseEntity.ok(new ApiResponse<>(true, null, details));
    }

    @PostMapping("/{promotionRequestId}/analyze")
    public ResponseEntity<ApiResponse<String>> generateAIAnalysis(
            @PathVariable Integer promotionRequestId) {
        String analysis = promotionRequestService.generateAIAnalysis(promotionRequestId);
        return ResponseEntity.ok(new ApiResponse<>(true, "AI analysis generated successfully", analysis));
    }

    @PatchMapping("/{promotionRequestId}/approve")
    public ResponseEntity<ApiResponse<String>> approvePromotionRequest(
            @PathVariable Integer promotionRequestId,
            @RequestBody(required = false) PromotionApprovalDTO approvalDTO) {
        
        String message = approvalDTO != null ? approvalDTO.getMessage() : null;
        promotionRequestService.approvePromotionRequest(promotionRequestId, message);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Promotion request approved successfully.", "APPROVED"));
    }

    @PatchMapping("/{promotionRequestId}/reject")
    public ResponseEntity<ApiResponse<String>> rejectPromotionRequest(
            @PathVariable Integer promotionRequestId,
            @RequestBody PromotionApprovalDTO rejectionDTO) {
        
        promotionRequestService.rejectPromotionRequest(promotionRequestId, rejectionDTO.getMessage());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Promotion request rejected successfully.", "REJECTED"));
    }

}
