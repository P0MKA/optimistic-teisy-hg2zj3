export default function BookItem ({ item }) {
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.author.name}</td>
    </tr>
  );
};