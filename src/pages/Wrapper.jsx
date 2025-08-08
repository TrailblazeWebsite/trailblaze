import Navbar from "../components/Navbar/Navbar";

function Wrapper({ children }) {
    return (
        <>
            <Navbar />
            <div className="main-content">{children}</div>
        </>
    );

}

export default Wrapper;
