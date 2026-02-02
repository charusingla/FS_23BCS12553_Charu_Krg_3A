import {navigate} from "react-router-dom";
import { useAuth } from "../context/authcontext";

const ProtectedRoute = ({ childeren}) => {
    const {isAuthenticated} = useAuth;

    if(!isAuthenticated)
    {
        return <navigate to = "/login" replace />
    }

    return childeren;
};

export default ProtectedRoute;