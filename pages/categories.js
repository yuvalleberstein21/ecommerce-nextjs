import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {

    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);


    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    const saveCategory = async (e) => {
        const data = { name, parentCategory }
        e.preventDefault();
        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data);
        } else {
            await axios.post('/api/categories', data);
        }

        setName('');
        fetchCategories();
    }

    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <form onSubmit={saveCategory}>
                <label>
                    {editedCategory
                        ? `Edit category ${editedCategory.name}`
                        : 'Create new category'
                    }
                </label>
                <div className="flex gap-1">
                    <input
                        className="mb-0"
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        onChange={(e) => setParentCategory(e.target.value)}
                        className="mb-0"
                        value={parentCategory}>
                        <option value="">No parent category</option>
                        {
                            categories.length > 0 && categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        }
                    </select>
                    <button type="submit" className="btn-primary py-1">
                        Save
                    </button>
                </div>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Cateogry name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button
                                        onClick={() => editCategory(category)}
                                        className="btn-primary mr-1">
                                        Edit
                                    </button>
                                    <button className="btn-primary">Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Layout>
    )
}