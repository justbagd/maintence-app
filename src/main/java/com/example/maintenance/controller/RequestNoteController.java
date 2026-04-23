package com.example.maintenance.controller;

import com.example.maintenance.model.RequestNote;
import com.example.maintenance.service.RequestNoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestNoteController {

    private final RequestNoteService noteService;

    public RequestNoteController(RequestNoteService noteService) {
        this.noteService = noteService;
    }

    // GET /api/requests/{requestId}/notes
    @GetMapping("/{requestId}/notes")
    public List<RequestNote> getNotesByRequest(@PathVariable Long requestId) {
        return noteService.getByRequest(requestId);
    }

    // GET /api/requests/{requestId}/notes/{noteId}
    @GetMapping("/{requestId}/notes/{noteId}")
    public ResponseEntity<RequestNote> getNoteById(
            @PathVariable Long requestId,
            @PathVariable Long noteId) {
        return noteService.getByRequestAndId(requestId, noteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/requests/{requestId}/notes
    @PostMapping("/{requestId}/notes")
    public ResponseEntity<RequestNote> addNote(
            @PathVariable Long requestId,
            @RequestBody RequestNote note) {
        return ResponseEntity.ok(noteService.addNote(requestId, note));
    }
}
