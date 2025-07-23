import { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { Task } from './Task';
import { Session } from '@supabase/supabase-js';

export function TaskManager({session} : {session: Session}) {
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editTaskData, setEditTaskData] = useState({
        id: null,
        title: '',
        description: '',
    });

    const isEditMode = editTaskData.id !== null && editTaskData.id !== undefined;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, data } = await supabase.from('tasks').insert({...newTask, email: session.user.email}).single();
        if (error) {
            console.error("Error Adding Task:", error.message);
            return;
        }
        console.log("Task added:", newTask);
        setNewTask({ title: "", description: "" });
        // fetchTasks();
    };

    const deleteTask = async (id) => {
        const { error } = await supabase.from('tasks').delete().eq("id", id);
        if (error) {
            console.error("Error Deleting Task:", error.message);
            return;
        }
        fetchTasks();
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find(task => task.id === id);
        if (taskToEdit) {
            setNewTask({ title: taskToEdit.title, description: taskToEdit.description });
            setEditTaskData({ id: taskToEdit.id, title: taskToEdit.title, description: taskToEdit.description });
        }
    };

    const updateTask = async () => {
        const { error } = await supabase
            .from('tasks')
            .update({ title: editTaskData.title, description: editTaskData.description })
            .eq("id", editTaskData.id);
        if (error) {
            console.error('Update error:', error.message);
        } else {
            setNewTask({ title: "", description: "" });
            setEditTaskData({ id: null, title: '', description: '' });
            fetchTasks();
        }
    };

    const fetchTasks = async () => {
        const { error, data } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
        if (error) {
            console.error('Fetch error:', error.message);
        } else {
            setTasks(data as Task[]);
        }
    };

    const backEdit = () => {
        setEditTaskData({ id: null, title: '', description: '' });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const channel = supabase
        .channel('tasks-channel')
        .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => {
            const newTask = payload.new as Task;
            setTasks((prev) => [...prev, newTask]);
            console.log('New task inserted:', newTask);
        }
        ).subscribe((status) => {
            console.log("Subscription", status);
        });
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="text-danger">PT Task Tracker CRUD</h1>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label d-flex">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            placeholder="Title..."
                                            value={isEditMode ? editTaskData.title : newTask.title}
                                            onChange={(e) =>
                                                isEditMode
                                                    ? setEditTaskData((prev) => ({ ...prev, title: e.target.value }))
                                                    : setNewTask((prev) => ({ ...prev, title: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label d-flex">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            placeholder="....."
                                            value={isEditMode ? editTaskData.description : newTask.description}
                                            onChange={(e) =>
                                                isEditMode
                                                    ? setEditTaskData((prev) => ({ ...prev, description: e.target.value }))
                                                    : setNewTask((prev) => ({ ...prev, description: e.target.value }))
                                            }
                                        ></textarea>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        {isEditMode ? (
                                            <>
                                                <button type="button" className="btn btn-warning" onClick={updateTask}>Update Task</button>
                                                <button type="button" className="btn btn-danger mx-1" onClick={backEdit}>Back</button>
                                            </>
                                        ) : (
                                            <button type="submit" className="btn btn-success">Save</button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-12">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Title</th>
                                    <th>Desc</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>
                                            <button className="btn btn-warning" onClick={() => editTask(task.id)}>Edit</button>
                                            <button className="btn btn-danger mx-1" onClick={() => deleteTask(task.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}