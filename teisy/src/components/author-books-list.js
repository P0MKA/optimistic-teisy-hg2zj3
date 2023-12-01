import { useParams } from "react-router-dom";
import BookItem from "./book";

export default function AuthorBookList ({ items }) {
  const { id } = useParams();
  const filtered_items = items.filter((item) => {
    return item.author.id === +id;
  });

  return (
    <table>
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>AUTHOR</th>
      </tr>
      {filtered_items.map((item) => (
        <BookItem item={item} />
      ))}
    </table>
  );
};