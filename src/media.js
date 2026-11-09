// The kinds of media a host can say its form takes, through the `selectableMedia` prop. A kind is
// the first half of a mimetype, so a file's own kind is read from it the same way.
const MEDIA = {
  video: {
    canvaFormat: "MP4",
    label: "Video",
    noun: "video",
    plural: "videos",
  },
  image: {
    canvaFormat: "JPG",
    label: "Picture",
    noun: "picture",
    plural: "pictures",
  },
};

// The prop as the host gave it, keeping only kinds listed above, in the order of MEDIA.
const takenMedia = (selectableMedia) =>
  Object.keys(MEDIA).filter((kind) => selectableMedia?.includes(kind));

// Whatever else the host put in the prop, so it can be told rather than quietly ignored.
const unknownMedia = (selectableMedia) =>
  (selectableMedia ?? []).filter((kind) => !MEDIA[kind]);

const mediaKindOf = (file) => file.mimetype?.split("/")[0];

// What a Canva design can be brought in as. A host that does not say what it takes gets a picture.
const canvaKindsFor = (selectableMedia) =>
  selectableMedia.length ? selectableMedia : ["image"];

// "videos", "pictures", or "videos and pictures".
const pluralOf = (selectableMedia) =>
  selectableMedia.map((kind) => MEDIA[kind].plural).join(" and ");

export {
  canvaKindsFor,
  MEDIA,
  mediaKindOf,
  pluralOf,
  takenMedia,
  unknownMedia,
};
