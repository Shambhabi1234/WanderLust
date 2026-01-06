export default function BookingImg({place, index=0, className=null}) {
  // If no photos exist, return nothing
  if (!place.photos?.length) {
    return '';
  }
  
  // Default styling if none is provided
  if (!className) {
    className = 'object-cover aspect-square rounded-2xl';
  }

  return (
    <img 
      className={className} 
      src={'http://localhost:5000/uploads/' + place.photos[index]} 
      alt={place.title} 
    />
  );
}