const Header = ({ title }) => {
    return (
    <header style = {{padding:"0.5 rem", backgroundColor: "#4CAF50", color: "white"}}>
        <h1>{title}</h1>
    </header>
    );
}

export default Header;