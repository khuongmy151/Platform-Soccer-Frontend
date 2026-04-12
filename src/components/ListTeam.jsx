import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

const ListTeam = ({ data }) => {
  const handleUpdateTeam = (id) => {
    alert(id);
  };
  const handleDeleteTeam = (id) => {
    alert(id);
  };
  return (
    <>
      <table className="w-[90%] mt-4 mx-auto border-collapse overflow-hidden rounded-[16px]">
        <thead className="h-[55px] uppercase text-title-sm text-surface-nav font-bold">
          <tr>
            <th className="text-left px-4">Logo</th>
            <th className="text-left px-4">Team Name</th>
            <th className="text-left px-4">Description</th>
            {/* <th className="text-left px-4">Members</th>
            <th className="text-left px-4">Players</th> */}
            <th className="text-center px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-surface-white">
          {data?.map((value, index) => {
            return (
              <tr key={index} className="hover:bg-surface-bg transition-colors">
                {/* LOGO */}
                <td className="px-4 py-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={value.logo_url}
                      alt="logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                {/* TEAM NAME (Team name, JerseyImage, Country) */}
                <td className="px-4 py-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {/* Team name */}
                      <span className="text-brand-primary text-title-lg font-bold">
                        {value.name}
                      </span>

                      {/* JerseyImage */}
                      <div className="flex items-center justify-center bg-surface-white rounded-md p-1 border border-surface-bg shadow-sm shrink-0">
                        {value.kit_url?.map((value, index) => {
                          return (
                            <img
                              key={index}
                              src={value}
                              alt="Jersey"
                              className="w-6 h-6 object-contain"
                              title="Team Jersey"
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Country */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-label-lg text-surface-nav font-bold uppercase">
                        {value.country}
                      </span>
                    </div>
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="px-4 py-6 max-w-[250px]">
                  <p className="text-label-lg text-surface-nav line-clamp-2">
                    {value.description}
                  </p>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-6">
                  <div className="flex items-center justify-center space-x-4">
                    <Link to={`/teams/${value.id}`}>
                      <FaEye className="w-5 h-5 hover:cursor-pointer hover:scale-105 transition-transform duration-300" />
                    </Link>
                    <MdEdit
                      onClick={() => handleUpdateTeam(value.id)}
                      className="w-5 h-5 hover:cursor-pointer hover:scale-105 transition-transform duration-300"
                    />
                    <MdDelete
                      onClick={() => handleDeleteTeam(value.id)}
                      className="w-5 h-5 hover:cursor-pointer hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default ListTeam;
