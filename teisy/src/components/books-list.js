import BookItem from "./book";

export default function BooksList ({ items }) {
  return (
    <table>
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>AUTHOR</th>
      </tr>
      {items.map((item) => (
        <BookItem item={item} />
      ))}
    </table>
  );
};