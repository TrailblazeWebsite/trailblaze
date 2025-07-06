import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import { useState } from "react";
import styles from "./AddPlace.module.css"
import PlaceDummy from "../../components/PlaceDummy/PlaceDummy";

function AddPlace() {
    const [name, setName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [rating, setRating] = useState("");



    // Handler wird bei jeder Änderung im Input aufgerufen
    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "shortDescription":
                setShortDescription(value);
                break;
            case "description":
                setDescription(value);
                break;
            case "coordinates":
                setCoordinates(value);
                break;
            case "rating":
                setRating(value);
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <AdminNavbar/>
            <div className={styles.container}>
                <div className={styles.input}>
                    <label htmlFor="meinTextfeld" className="block mb-2 font-semibold">
                        Dein Text:
                    </label>

                    <input
                        id="meinTextfeld"
                        type="text"
                        value={name}
                        onChange={handleChange}
                        placeholder="Tippe etwas ein…"
                        className="border rounded px-3 py-2 w-full"
                    />

                    <input
                        id="meinTextfeld"
                        type="text"
                        value={shortDescription}
                        onChange={handleChange}
                        placeholder="Tippe etwas ein…"
                        className="border rounded px-3 py-2 w-full"
                    />

                    <input
                        id="meinTextfeld"
                        type="text"
                        value={description}
                        onChange={handleChange}
                        placeholder="Tippe etwas ein…"
                        className="border rounded px-3 py-2 w-full"
                    />

                    <input
                        id="meinTextfeld"
                        type="text"
                        value={coordinates}
                        onChange={handleChange}
                        placeholder="Tippe etwas ein…"
                        className="border rounded px-3 py-2 w-full"
                    />

                    <input
                        id="meinTextfeld"
                        type="text"
                        value={rating}
                        onChange={handleChange}
                        placeholder="Tippe etwas ein…"
                        className="border rounded px-3 py-2 w-full"
                    />

                    <button>
                        submit
                    </button>
                </div>
                <div className={styles.pagePreview}>
                    <PlaceDummy/>
                </div>
            </div>
        </div>
    )
}

export default AddPlace