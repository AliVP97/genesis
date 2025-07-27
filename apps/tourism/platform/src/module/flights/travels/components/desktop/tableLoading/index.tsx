import Skeleton from 'components/skeleton';

const TripsTableLoading = () => {
  return (
    <tbody>
      {new Array(3).fill(null).map((_, i) => (
        <tr key={i.toString() + 'travels-table'} className="travels-table-loading">
          <td colSpan={9}>
            <Skeleton
              type="myTravelsDesktop"
              uniqueKey="myTravelsDesktop"
              width="100%"
              height="50px"
            />
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TripsTableLoading;
