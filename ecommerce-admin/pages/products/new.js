import React from "react";
import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";



const NewProduct = () => {

    return (
        <Layout>
            <h1>New Product</h1>
            <ProductForm />
        </Layout>
    );
};

export default NewProduct;
