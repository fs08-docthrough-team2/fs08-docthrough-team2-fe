import DropdownCategory from '@/components/molecules/DropdownCategory/DropdownCategory';
import DropdownDocument from '@/components/molecules/DropdownDocument/DropdownDocument';
import DropdownSort from '@/components/molecules/DropdownSort/DropdownSort';

const Home = () => {
  return (
    <div>
      Category
      <DropdownCategory />
      <br />
      Sort
      <DropdownSort />
      <br />
      Document
      <DropdownDocument />
      <br />
    </div>
  );
};

export default Home;
