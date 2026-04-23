package com.example.maintenance.repository;

import com.example.maintenance.model.RequestNote;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class RequestNoteRepository {

    private final List<RequestNote> notes = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public RequestNoteRepository() {
    }

    public List<RequestNote> findByRequestId(Long requestId) {
        List<RequestNote> result = new ArrayList<>();
        for (RequestNote n : notes) {
            if (n.getRequestId().equals(requestId)) result.add(n);
        }
        return result;
    }

    public Optional<RequestNote> findByRequestIdAndNoteId(Long requestId, Long noteId) {
        return notes.stream()
                .filter(n -> n.getRequestId().equals(requestId) && n.getNoteId().equals(noteId))
                .findFirst();
    }

    public RequestNote save(RequestNote note) {
        if (note.getNoteId() == null) {
            note.setNoteId(idCounter.getAndIncrement());
            notes.add(note);
        } else {
            for (int i = 0; i < notes.size(); i++) {
                if (notes.get(i).getNoteId().equals(note.getNoteId())) {
                    notes.set(i, note);
                    return note;
                }
            }
            notes.add(note);
        }
        return note;
    }
}
