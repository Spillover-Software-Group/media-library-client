import { gql } from "@apollo/client";

// A stored file as a host receives it, with the fields a folder entry carries (`modDate` included,
// which hosts read), so a file made on the way (a Canva export, a generated image) is judged and
// used like one picked from a folder.
const HANDED_FILE_FIELDS = gql`
  fragment HandedFileFields on File {
    id
    name
    mimetype
    size
    url
    thumbnailUrl
    modDate: updatedAt
    aiLabel {
      caption
    }
  }
`;

export default HANDED_FILE_FIELDS;
