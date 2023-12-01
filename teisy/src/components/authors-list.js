import AuthorItem from './author';


export default function AuthorsList ({ items }) {
  return (
    <table>
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>BIRTHDAY_YEAR</th>
      </tr>
      {items.map((item) => (
        <AuthorItem item={item} />
      ))}
    </table>
  );
};