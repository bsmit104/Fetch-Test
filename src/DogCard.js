/* global React */

function DogCard({ dog, onFavorite, isFavorite }) {
  return (
    <div className="bg-white p-6 border border-teal-200 rounded-lg shadow-sm hover:shadow-md transition relative">
      <button
        onClick={() => onFavorite(dog.id)}
        className="absolute top-2 right-2 focus:outline-none"
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        <img
          src={isFavorite ? 'assets/heart.svg' : 'assets/heartOutline.svg'}
          alt={isFavorite ? 'Filled Heart' : 'Outlined Heart'}
          className="w-6 h-6"
        />
      </button>
      <img
        src={dog.img}
        alt={dog.name}
        className="w-40 h-40 object-cover rounded-lg mb-4 mx-auto"
      />
      <h3 className="text-xl font-medium text-gray-800">{dog.name}</h3>
      <p className="text-gray-700"><span className="font-medium">Breed:</span> {dog.breed}</p>
      <p className="text-gray-700"><span className="font-medium">Age:</span> {dog.age} years</p>
      <p className="text-gray-700"><span className="font-medium">Zip Code:</span> {dog.zip_code}</p>
    </div>
  );
}

window.DogCard = DogCard;