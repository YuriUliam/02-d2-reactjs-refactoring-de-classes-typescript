import { useState, useCallback, useEffect } from 'react';

import { IFood } from '../../types'

import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

export const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<Array<IFood>>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods');

      setFoods(response.data)
    }

    getFoods()
  }, []);

  const handleAddFood = useCallback(async (food: IFood) => {
    try {
      const newFoodResponse = await api.post('/foods', {
        ...food,
        available: true,
      });

      const newFoodData = newFoodResponse.data

      setFoods(oldFoods => [...oldFoods, newFoodData]);
    } catch (err) {
      console.log(err);
    }
  }, [])

  const handleUpdateFood = useCallback(async (food: IFood) => {
    try {
      const updatedFoodresponse = await api.put<IFood>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const updatedFoodData = updatedFoodresponse.data

      const foodsUpdated = foods.map(food =>
        food.id !== updatedFoodData.id ? food : updatedFoodData,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }, [foods, editingFood])

  const handleDeleteFood = useCallback(async (foodId: number) => {
    await api.delete(`/foods/${foodId}`);

    const filteredFoods = foods.filter(food => food.id !== foodId);

    setFoods(filteredFoods);
  }, [foods]) 

  const toggleModal = useCallback(() => {
    setIsModalOpen(oldIsModalOpen => !oldIsModalOpen)
  }, [])

  const toggleEditModal = useCallback(() => {
    setIsEditModalOpen(oldIsEditModalOpen => !oldIsEditModalOpen)
  }, [])

  const handleEditFood = useCallback((food: IFood) => {
    setEditingFood(food)
    setIsEditModalOpen(true)
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

// class Dashboard extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     foods: [],
  //     editingFood: {},
  //     modalOpen: false,
  //     editModalOpen: false,
  //   }
  // }

  // async componentDidMount() {
  //   const response = await api.get('/foods');

  //   this.setState({ foods: response.data });
  // }

  // handleAddFood = async food => {
  //   const { foods } = this.state;

  //   try {
  //     const response = await api.post('/foods', {
  //       ...food,
  //       available: true,
  //     });

  //     this.setState({ foods: [...foods, response.data] });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // handleUpdateFood = async food => {
  //   const { foods, editingFood } = this.state;

  //   try {
  //     const foodUpdated = await api.put(
  //       `/foods/${editingFood.id}`,
  //       { ...editingFood, ...food },
  //     );

  //     const foodsUpdated = foods.map(f =>
  //       f.id !== foodUpdated.data.id ? f : foodUpdated.data,
  //     );

  //     this.setState({ foods: foodsUpdated });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // handleDeleteFood = async id => {
  //   const { foods } = this.state;

  //   await api.delete(`/foods/${id}`);

  //   const foodsFiltered = foods.filter(food => food.id !== id);

  //   this.setState({ foods: foodsFiltered });
  // }

  // toggleModal = () => {
  //   const { modalOpen } = this.state;

  //   this.setState({ modalOpen: !modalOpen });
  // }

  // toggleEditModal = () => {
  //   const { editModalOpen } = this.state;

  //   this.setState({ editModalOpen: !editModalOpen });
  // }

  // handleEditFood = food => {
  //   this.setState({ editingFood: food, editModalOpen: true });
  // }

  // render() {
  //   const { modalOpen, editModalOpen, editingFood, foods } = this.state;

  //   return (
  //     <>
  //       <Header openModal={this.toggleModal} />
  //       <ModalAddFood
  //         isOpen={modalOpen}
  //         setIsOpen={this.toggleModal}
  //         handleAddFood={this.handleAddFood}
  //       />
  //       <ModalEditFood
  //         isOpen={editModalOpen}
  //         setIsOpen={this.toggleEditModal}
  //         editingFood={editingFood}
  //         handleUpdateFood={this.handleUpdateFood}
  //       />

  //       <FoodsContainer data-testid="foods-list">
  //         {foods &&
  //           foods.map(food => (
  //             <Food
  //               key={food.id}
  //               food={food}
  //               handleDelete={this.handleDeleteFood}
  //               handleEditFood={this.handleEditFood}
  //             />
  //           ))}
  //       </FoodsContainer>
  //     </>
  //   );
  // }
// };

// export default Dashboard;
