import { Link } from "react-router-dom";

const JoinForm = () => {
  return (
    <div>
        <form className="flex flex-col bg-amber-500 w-100 h-100 m-auto justify-center    ">
            <input type="text" className="bg-amber-950 text-center" placeholder="Enter Game Code" />
            <input type="password" className="bg-amber-700 text-center" placeholder="Enter Password" />
            <Link to='/profile'>Join Game</Link>
        </form>
    </div>
  )
}

export default JoinForm;