import Layout from "@/components/Layout";
import React from "react";

const NewProduct = () => {
    return (
        <Layout>
            <h1>New Product</h1>
            <label>Product name</label>
            <input type="text" placeholder="product name" />
            <label>Description</label>
            <textarea placeholder="description"></textarea>
            <label>Price (in USD)</label>
            <input type="number" placeholder="price" />
            <button className="btn-primary">Save</button>
        </Layout>
    );
};

export default NewProduct;
