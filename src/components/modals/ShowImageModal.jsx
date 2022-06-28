import Modal from "./Modal";

function ShowImageModal({ isOpen, setIsOpen, file }) {
  if (!file) return null;

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      customStyles="w-fil inline-block overflow-hidden align-middle transition-all transform"
    >
      <div className="flex justify-evenly items-center mt-2">
        <div className="w-full">
          <img
            src={file.url}
            alt={file.name}
            className="object-cover w-full h-128"
          />
          <p>{ file.name }</p>
          <div className="flex justify-evenly items-center mt-6">
            <button
              className="bg-spillover-color2 hover:bg-black px-3 py-1 text-xs md:text-sm text-white rounded-2xl transition ease-in-out duration-300"
              type="submit"
              onClick={closeModal}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ShowImageModal;
