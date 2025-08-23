import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Clock, CheckCircle, AlertCircle, StickyNote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const initialTodos = [
  {
    id: 1,
    title: "Edit wedding photos for Johnson family",
    description: "Complete color correction and retouching for 150 wedding photos",
    completed: false,
    priority: "high",
    dueDate: "2024-02-10",
    category: "Editing"
  },
  {
    id: 2,
    title: "Send invoice to Tech Corp",
    description: "Corporate event photography payment pending",
    completed: true,
    priority: "medium",
    dueDate: "2024-02-08",
    category: "Business"
  },
  {
    id: 3,
    title: "Backup equipment check",
    description: "Check all camera equipment before weekend shoots",
    completed: false,
    priority: "medium",
    dueDate: "2024-02-12",
    category: "Equipment"
  }
];

const initialNotes = [
  {
    id: 1,
    title: "Wedding Photography Tips",
    content: "Remember to capture: ring shots, first look reactions, ceremony details, reception candids. Always bring backup batteries and memory cards.",
    category: "Tips",
    createdDate: "2024-02-05",
    lastModified: "2024-02-05"
  },
  {
    id: 2,
    title: "Client Preferences - Emma & Mike",
    content: "Prefer natural lighting, avoid flash during ceremony. Want more candid shots than posed. Love vintage editing style.",
    category: "Client Notes",
    createdDate: "2024-02-03",
    lastModified: "2024-02-04"
  }
];

export function PhotographerNotes() {
  const [todos, setTodos] = useState(initialTodos);
  const [notes, setNotes] = useState(initialNotes);
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'General'
  });
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'General'
  });
  const { toast } = useToast();

  const handleAddTodo = () => {
    if (!newTodo.title) {
      toast({
        title: "Error",
        description: "Please enter a title for the todo",
        variant: "destructive"
      });
      return;
    }

    const todo = {
      id: Date.now(),
      ...newTodo,
      completed: false
    };

    setTodos([...todos, todo]);
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '', category: 'General' });
    setShowTodoDialog(false);
    
    toast({
      title: "Success",
      description: "Todo added successfully"
    });
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Success",
      description: "Todo deleted successfully"
    });
  };

  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const note = {
      id: Date.now(),
      ...newNote,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    setNotes([...notes, note]);
    setNewNote({ title: '', content: '', category: 'General' });
    setShowNoteDialog(false);
    
    toast({
      title: "Success",
      description: "Note added successfully"
    });
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Success",
      description: "Note deleted successfully"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const renderTodoCard = (todo: any) => (
    <Card key={todo.id} className={`mb-4 ${todo.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => handleToggleTodo(todo.id)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                {todo.title}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Badge>
                <Badge variant="outline">{todo.category}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{todo.description}</p>
            {todo.dueDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Due: {todo.dueDate}
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingTodo(todo);
                setShowTodoDialog(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNoteCard = (note: any) => (
    <Card key={note.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{note.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{note.category}</Badge>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingNote(note);
                  setShowNoteDialog(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteNote(note.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{note.content}</p>
        <p className="text-xs text-muted-foreground">
          Created: {note.createdDate} • Modified: {note.lastModified}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notes & Reminders</h1>
      </div>

      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">
            Todo List ({todos.filter(t => !t.completed).length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes ({notes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Completed: {todos.filter(t => t.completed).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Pending: {todos.filter(t => !t.completed).length}</span>
              </div>
            </div>
            <Dialog open={showTodoDialog} onOpenChange={setShowTodoDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingTodo(null);
                  setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '', category: 'General' });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Todo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={editingTodo ? editingTodo.title : newTodo.title}
                      onChange={(e) => editingTodo 
                        ? setEditingTodo({...editingTodo, title: e.target.value})
                        : setNewTodo({...newTodo, title: e.target.value})
                      }
                      placeholder="Enter todo title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingTodo ? editingTodo.description : newTodo.description}
                      onChange={(e) => editingTodo
                        ? setEditingTodo({...editingTodo, description: e.target.value})
                        : setNewTodo({...newTodo, description: e.target.value})
                      }
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select
                        value={editingTodo ? editingTodo.priority : newTodo.priority}
                        onChange={(e) => editingTodo
                          ? setEditingTodo({...editingTodo, priority: e.target.value})
                          : setNewTodo({...newTodo, priority: e.target.value})
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={editingTodo ? editingTodo.dueDate : newTodo.dueDate}
                        onChange={(e) => editingTodo
                          ? setEditingTodo({...editingTodo, dueDate: e.target.value})
                          : setNewTodo({...newTodo, dueDate: e.target.value})
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={editingTodo ? editingTodo.category : newTodo.category}
                      onChange={(e) => editingTodo
                        ? setEditingTodo({...editingTodo, category: e.target.value})
                        : setNewTodo({...newTodo, category: e.target.value})
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="General">General</option>
                      <option value="Editing">Editing</option>
                      <option value="Business">Business</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                  <Button onClick={editingTodo ? () => {
                    setTodos(todos.map(todo =>
                      todo.id === editingTodo.id ? editingTodo : todo
                    ));
                    setEditingTodo(null);
                    setShowTodoDialog(false);
                    toast({
                      title: "Success",
                      description: "Todo updated successfully"
                    });
                  } : handleAddTodo} className="w-full">
                    {editingTodo ? 'Update Todo' : 'Add Todo'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {todos.length > 0 ? (
            todos.map(renderTodoCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No todos yet</h3>
                <p className="text-muted-foreground">Create your first todo to get organized</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingNote(null);
                  setNewNote({ title: '', content: '', category: 'General' });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={editingNote ? editingNote.title : newNote.title}
                      onChange={(e) => editingNote
                        ? setEditingNote({...editingNote, title: e.target.value})
                        : setNewNote({...newNote, title: e.target.value})
                      }
                      placeholder="Enter note title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={editingNote ? editingNote.content : newNote.content}
                      onChange={(e) => editingNote
                        ? setEditingNote({...editingNote, content: e.target.value})
                        : setNewNote({...newNote, content: e.target.value})
                      }
                      placeholder="Enter note content"
                      rows={6}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={editingNote ? editingNote.category : newNote.category}
                      onChange={(e) => editingNote
                        ? setEditingNote({...editingNote, category: e.target.value})
                        : setNewNote({...newNote, category: e.target.value})
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="General">General</option>
                      <option value="Tips">Tips</option>
                      <option value="Client Notes">Client Notes</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Ideas">Ideas</option>
                    </select>
                  </div>
                  <Button onClick={editingNote ? () => {
                    setNotes(notes.map(note =>
                      note.id === editingNote.id 
                        ? {...editingNote, lastModified: new Date().toISOString().split('T')[0]}
                        : note
                    ));
                    setEditingNote(null);
                    setShowNoteDialog(false);
                    toast({
                      title: "Success",
                      description: "Note updated successfully"
                    });
                  } : handleAddNote} className="w-full">
                    {editingNote ? 'Update Note' : 'Add Note'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {notes.length > 0 ? (
            notes.map(renderNoteCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                <p className="text-muted-foreground">Create your first note to capture ideas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}