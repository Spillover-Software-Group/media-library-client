import { gql } from "@apollo/client";

// A stored file as a host receives it, with what the host's rules read (`mimetype`, `size`), so a
// file made on the way (a Canva export, a generated image) is judged like one picked from a folder.
const HANDED_FILE_FIELDS = gql`
  fragment HandedFileFields on File {
    id
    name
    mimetype
    size
    url
    thumbnailUrl
    aiLabel {
      caption
    }
  }
`;

export default HANDED_FILE_FIELDS;
