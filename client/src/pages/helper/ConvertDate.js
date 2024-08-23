export const formatDate = (mySqlDate) => {
    const date = new Date(mySqlDate);
    
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate();
    const month = (date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();
    
    const formattedDate = `${hours}:${minutes} - ${day}.${month}.${year}`;
    return formattedDate
}