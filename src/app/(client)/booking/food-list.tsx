import { useFoodList } from "@/queries/useFoodQuery";
import { Minus, Plus } from "lucide-react";

export default function FoodListClient({ selectedFoods, setSelectedFoods }: any) {
    const { data } = useFoodList({});
    const foods = data?.data || [];

    const updateQuantity = (food: any, delta: number) => {
        const existed = selectedFoods.find((f: any) => f._id === food._id);
        if (existed) {
            const newQty = existed.quantity + delta;
            if (newQty <= 0) {
                setSelectedFoods(selectedFoods.filter((f: any) => f._id !== food._id));
            } else {
                setSelectedFoods(selectedFoods.map((f: any) => 
                    f._id === food._id ? { ...f, quantity: newQty } : f
                ));
            }
        } else if (delta > 0) {
            setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
        }
    };

    return (
        <div className="space-y-6 w-full">
            <h3 className="text-xl font-bold text-white mb-4">Chọn đồ ăn (Combo)</h3>
            {foods.map((food: any) => {
                const qty = selectedFoods.find((f: any) => f._id === food._id)?.quantity || 0;
                return (
                    <div key={food._id} className="flex items-center gap-4 bg-black  p-4 rounded-lg border border-neutral-800">
                        <img src={food.image} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                            <h4 className="text-white font-bold">{food.name}</h4>
                            <p className="text-sm text-neutral-400">{food.description}</p>
                            <p className="text-blue font-bold mt-1">{food.price.toLocaleString()}đ</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(food, -1)} className="p-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white">
                                <Minus size={16} />
                            </button>
                            <span className="text-white w-5 text-center">{qty}</span>
                            <button onClick={() => updateQuantity(food, 1)} className="p-1 rounded-full bg-blue hover:bg-blue-600 text-white">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}