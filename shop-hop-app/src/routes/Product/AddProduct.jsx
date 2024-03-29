import InputField from "../../components/InputField.jsx";
import {useState} from "react";
import ProductRepository from "../../repositories/ProductRepository.js";
import { useNavigate } from "react-router-dom";
import "../../components/Form.css";
import { toast } from 'react-toastify';

function AddProduct() {
    const productRepository = new ProductRepository()
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: ""
    });
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();
    const handleChange = (name, value) => {
        setProduct((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }
    async function addProduct(){
        return await productRepository.AddProduct(product)
            .catch(error => {
                console.error("Error editing product:", error);
            });
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const emptyField = Object.values(product).some(
            (value) => value === ""
        );
        if (emptyField){
            setErrorMessage("Product is not complete")
            setProduct({
                name: "",
                price: "",
                description: ""
            })
        }
        else{
            addProduct()
                .then((responseData) =>{
                    if (responseData) {
                        setErrorMessage("");
                        navigate("/ProductDashboard");
                        toast.success("Product added successfully!");
                    } else {
                        console.error("Offline error occurred");
                        setErrorMessage("Failed to add product due to network issues");
                    }
                })
                .catch((error) => {
                    console.error("AddSubmit failed:", error);
                    setErrorMessage("Failed to add product");
                });
        }
    }
    return (
        <div className="FormContainer">
            <form onSubmit={handleSubmit}>
                <InputField label="Name" type="text" value={product.name}
                            onChange={(value) => handleChange('name', value)}/>
                <InputField label="Price" type="price" value={product.price}
                            onChange={(value) => handleChange('price', value)}/>
                <InputField label="Description" type="textarea" value={product.description}
                            onChange={(value) => handleChange('description', value)}/>
                <p style={{color: "red", marginTop: 0}}>{errorMessage}</p>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
export default AddProduct