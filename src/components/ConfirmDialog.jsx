const ConfirmDialog = ({ ref, message, handleConfirm }) => {
  return (
    <>
      <dialog
        ref={ref}
        className="p-8 m-auto rounded-3xl shadow-2xl border-none w-[90%] max-w-sm 
               backdrop:bg-black/10 backdrop:backdrop-blur-[2px] overflow-hidden"
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-gray-700 text-md font-medium mb-6 leading-relaxed">
            {message}
          </p>
          <div className="flex gap-3 w-full">
            <button
              data-umami-event="Cancel confirm button click"
              onClick={() => ref?.current.close()}
              className="flex-1 px-4 py-2.5 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              Hủy
            </button>
            <button
              data-umami-event="Confirm button click"
              onClick={handleConfirm}
              className="flex-[1.5] px-4 py-2.5 text-white font-bold rounded-xl shadow-lg 
                     bg-[linear-gradient(135deg,#ff4444,#ff8c00)] 
                     hover:opacity-90 hover:scale-[1.02] active:scale-95 
                     transition-all duration-200"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default ConfirmDialog;
