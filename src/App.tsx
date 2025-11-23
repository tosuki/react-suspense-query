import { LoadingCard } from "./components/cards/user/loading";
import { UserCard } from "./components/cards/user";

import "./styles.css";

const App = () => {
  return (
    <div className="container">
      <div className="cards-wrapper">
        <LoadingCard />
        <UserCard
          id={1}
          name="Carlos Henrique"
          email="okaabe2006@gmail.com"
          website="http://github.com/tosuki"
          phone="3399441133"
        />
      </div>
    </div>
  );
};

export default App;
