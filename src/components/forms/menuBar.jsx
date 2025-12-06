import { Link } from "react-router-dom"

const MenuBar = () => {
  return (
    <div className="flex flex-col bg-amber-500 w-100 h-100 m-auto justify-center    ">
        <Link to ='/join' className="bg-amber-950 text-center">Join Game</Link>
        <Link to ='/create' className="bg-amber-700 text-center">Create Game</Link>
    </div>
  )
}

export default MenuBar;