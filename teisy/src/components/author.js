import { Link } from "react-router-dom";

export default function AuthorItem({ item }) {
  return (
    <tr>
      <td>{item.id}</td>
      <td>
        <Link to={`/author/${item.id}`}>{item.name}</Link>
      </td>
      <td>{item.birthdayYear}</td>
    </tr>
  );
};
