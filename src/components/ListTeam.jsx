import { Link } from "react-router-dom";
import { FaEye, FaCircleNotch } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

const ListTeam = ({
  data,
  isLoading,
  handleOpenFormDialog,
  handleOpenConfirmDialog,
}) => {
  if (isLoading)
    return (
      <div className="flex gap-2 items-center w-[20%] mt-3 mx-auto">
        <FaCircleNotch className="animate-spin" />
        <p>Loading...</p>
      </div>
    );

  return (
    <>
      <div className="w-[90%] mt-4 mx-auto pb-10">
        {/* DESKTOP TABLE VIEW: Visible on screens md and up (>= 768px) */}
        <div className="hidden md:block bg-surface-white rounded-[20px] shadow-sm border border-header-line overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="h-[55px] bg-surface-bg uppercase text-label-sm tracking-wider text-nav-muted font-bold border-b border-header-line">
              <tr>
                <th className="text-left px-4">Logo</th>
                <th className="text-left px-4">Team Name</th>
                <th className="text-left px-4">Description</th>
                <th className="text-center px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface-white divide-y divide-surface-bg">
              {data?.length > 0 ? (
                data.map((value, index) => (
                  <tr
                    key={index}
                    className="hover:bg-surface-bg transition-colors border-b border-surface-bg last:border-none"
                  >
                    <td className="px-4 py-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-surface-bg shadow-sm">
                        <img
                          src={value.logo_url}
                          alt="logo"
                          className="w-full h-full object-cover bg-white"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-brand-primary text-title-lg font-bold tracking-wide">
                            {value.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-nav-muted/50"></div>
                          <span className="text-label-sm text-nav-muted font-bold tracking-widest uppercase">
                            {value.country}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-[250px]">
                      <p className="text-label-lg text-nav-muted line-clamp-2 md:font-medium">
                        {value.description}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-4 text-nav-muted">
                        <Link
                          to={`/teams/${value.id}`}
                          className="hover:text-blue-500 transition-colors"
                        >
                          <FaEye className="w-5 h-5 hover:scale-110 transition-transform" />
                        </Link>
                        <button
                          onClick={() => handleOpenFormDialog(value.id)}
                          className="hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <MdEdit className="w-5 h-5 hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleOpenConfirmDialog(value.id)}
                          className="hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <MdDelete className="w-5 h-5 hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    No result
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST VIEW: Visible on screens < 768px */}
        <div className="md:hidden flex flex-col w-full px-1">
          {/* HEADER */}
          <div className="flex items-center gap-2 mb-4 ml-1">
            <div className="w-[4px] h-5 bg-red-600 rounded-full"></div>
            <h2 className="text-surface-nav font-bold text-title-sm uppercase tracking-wider">
              Team List
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-surface-bg divide-y divide-surface-bg">
            {data?.length > 0 ? (
              data.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 active:bg-surface-bg transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-full border-2 border-brand-primary p-0.5 shrink-0 shadow-sm">
                      <img
                        src={value.logo_url}
                        alt="logo"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <span className="text-surface-nav font-bold text-title-md leading-tight truncate">
                      {value.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Link
                      to={`/teams/${value.id}`}
                      className="p-2.5 bg-surface-bg rounded-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <FaEye className="w-5 h-5 text-surface-nav" />
                    </Link>
                    <button
                      onClick={() => handleOpenFormDialog(value.id)}
                      className="p-2.5 bg-surface-bg rounded-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <MdEdit className="w-5 h-5 text-surface-nav" />
                    </button>
                    <button
                      onClick={() => handleOpenConfirmDialog(value.id)}
                      className="p-2.5 bg-surface-bg rounded-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      <MdDelete className="w-5 h-5 text-surface-nav" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center bg-surface-bg py-6">
                <p className="text-body-lg">No result</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListTeam;
