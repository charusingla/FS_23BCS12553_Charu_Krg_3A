const Header = ({ title }) => {
  return (
    <header 
      style={{padding: "0.5rem",backgroundColor: "#27ae60",color: "white",}}>
      <h1>{title}</h1>
      <nav>
        <Link to="/" style ={{marginRight:"1rem",color:"white"}}>
        Dashboard
        </Link>
        <Link to="/" style ={{marginRight:"1rem",color:"white"}}>
        Logs
        </Link>
        <Link to="/" style ={{marginRight:"1rem",color:"white"}}>
        Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;