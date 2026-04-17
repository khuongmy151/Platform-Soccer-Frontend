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
        <p>Đang tải dữ liệu team...</p>
      </div>
    );
  return (
    <>
      <div className="w-[90%] mt-4 mx-auto">
        {/* GIAO DIỆN TABLE: Chỉ hiện trên màn hình md trở lên (>= 768px) */}
        <table className="hidden md:table w-full border-collapse overflow-hidden rounded-[16px]">
          <thead className="h-[55px] uppercase text-title-sm text-nav-muted font-bold">
            <tr>
              <th className="text-left px-4">Logo</th>
              <th className="text-left px-4">Team Name</th>
              <th className="text-left px-4">Description</th>
              <th className="text-center px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface-white">
            {data?.length > 0 ? (
              data.map((value, index) => (
                <tr
                  key={index}
                  className="hover:bg-surface-bg transition-colors border-b border-surface-bg last:border-none"
                >
                  <td className="px-4 py-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={value.logo_url}
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-brand-primary text-title-lg font-bold">
                          {value.name}
                        </span>
                        <div className="flex items-center justify-center bg-surface-white rounded-md p-1 border border-surface-bg shadow-sm shrink-0">
                          {value.kit_url?.map((kit, i) => (
                            <img
                              key={i}
                              src={kit}
                              alt="Jersey"
                              className="w-6 h-6 object-contain"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-label-lg text-surface-nav font-bold uppercase">
                          {value.country}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6 max-w-[250px]">
                    <p className="text-label-lg text-surface-nav line-clamp-2">
                      {value.description}
                    </p>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center justify-center space-x-4">
                      <Link to={`/teams/${value.id}`}>
                        <FaEye className="w-5 h-5 hover:scale-105 transition-transform" />
                      </Link>
                      <MdEdit
                        onClick={() => handleOpenFormDialog(value.id)}
                        className="w-5 h-5 cursor-pointer hover:scale-105"
                      />
                      <MdDelete
                        onClick={() => handleOpenConfirmDialog(value.id)}
                        className="w-5 h-5 cursor-pointer hover:scale-105"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  Không tìm thấy kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* GIAO DIỆN MOBILE/SM: Chỉ hiện khi màn hình < 768px */}
        <div className="md:hidden flex flex-col w-full px-1">
          {/* TIÊU ĐỀ */}
          <div className="flex items-center gap-2 mb-4 ml-1">
            <div className="w-[4px] h-5 bg-red-600 rounded-full"></div>
            <h2 className="text-surface-nav font-bold text-title-sm uppercase tracking-wider">
              Team List
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-surface-bg divide-y divide-surface-bg">
            {data?.length > 0 &&
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
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default ListTeam;
