package com.example.maintenance.service;

import com.example.maintenance.model.RequestNote;
import com.example.maintenance.repository.RequestNoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestNoteService {

    private final RequestNoteRepository noteRepository;
    private final SseService sseService;

    public RequestNoteService(RequestNoteRepository noteRepository, SseService sseService) {
        this.noteRepository = noteRepository;
        this.sseService = sseService;
    }

    public List<RequestNote> getByRequest(Long requestId) {
        return noteRepository.findByRequestId(requestId);
    }

    public Optional<RequestNote> getByRequestAndId(Long requestId, Long noteId) {
        return noteRepository.findByRequestIdAndNoteId(requestId, noteId);
    }

    public RequestNote addNote(Long requestId, RequestNote note) {
        note.setRequestId(requestId);
        RequestNote saved = noteRepository.save(note);
        sseService.broadcast("note-added", "{\"type\":\"note-added\",\"requestId\":" + requestId + "}");
        return saved;
    }
}
