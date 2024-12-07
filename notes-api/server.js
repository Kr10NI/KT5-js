const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let notes = [];
let currentId = 1;

function createNote(title, content) {
    const created = new Date().toISOString();
    const note = {
        id: currentId++,
        title: title,
        content: content,
        created: created,
        changed: created
    };
    return note;
}

app.get('/notes', (req, res) => {
    if (notes.length === 0) {
        return res.status(404).json({ message: 'No notes found' });
    }
    res.status(200).json(notes);
});

app.get('/note/:id', (req, res) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
});

app.get('/note/read/:title', (req, res) => {
    const note = notes.find(n => n.title === req.params.title);
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
});

app.post('/note', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(409).json({ message: 'Title and content are required' });
    }

    const note = createNote(title, content);
    notes.push(note);
    res.status(201).json(note);
});

app.delete('/note/:id', (req, res) => {
    const index = notes.findIndex(n => n.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(409).json({ message: 'Note not found' });
    }

    notes.splice(index, 1);
    res.status(204).send();
});

app.put('/note/:id', (req, res) => {
    const { title, content } = req.body;
    const note = notes.find(n => n.id === parseInt(req.params.id));

    if (!note) {
        return res.status(409).json({ message: 'Note not found' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.changed = new Date().toISOString();

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
