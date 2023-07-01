import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {

    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);


    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    const saveCategory = async (e) => {
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(',')
            })),

        }
        e.preventDefault();
        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data);
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data);
        }

        setName('');
        setParentCategory('');
        setProperties([])
        fetchCategories();
    }

    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({ name, values }) => ({
            name,
            values: values.join(',')
        })))
    }

    const deleteCategory = (category) => {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    const addProperty = () => {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        })
    }


    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    const removeProperty = (indexToRemove) => {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });

        })
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory
                    ? `Edit category ${editedCategory.name}`
                    : 'Create new category'
                }
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        onChange={(e) => setParentCategory(e.target.value)}
                        value={parentCategory}>
                        <option value="">No parent category</option>
                        {
                            categories.length > 0 && categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-default text-sm mb-2">
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={(e) =>
                                    handlePropertyNameChange(index, property, e.target.value)}
                                placeholder="property name (example: color)"
                            />
                            <input type="text"
                                className="mb-0"
                                onChange={(e) =>
                                    handlePropertyValuesChange(index, property, e.target.value)}
                                value={property.values}
                                placeholder="values, comma separated"
                            />
                            <button
                                type="button"
                                onClick={() => removeProperty(index)}
                                className="btn-red">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('')
                                setProperties([])
                            }}
                            className="btn-default">
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        className="btn-primary py-1">
                        Save
                    </button>
                </div>

            </form>
            {!editedCategory && (
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
                                            className="btn-default mr-1">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category)}
                                            className="btn-red">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )}

        </Layout >
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));
