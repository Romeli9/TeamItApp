export const formatMessageTime = (timestamp: number) => {
  const now = new Date();
  const messageDate = new Date(timestamp);

  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const daysOfWeek = [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ];
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  // Только что (до 1 минуты назад)
  if (diffInSeconds < 60) {
    return 'Только что';
  }

  // Минуты назад (до 1 часа)
  if (diffInMinutes < 60) {
    const minutes = diffInMinutes % 60;
    return `${minutes} ${getRussianNoun(
      minutes,
      'минуту',
      'минуты',
      'минут',
    )} назад`;
  }

  // Сегодня (до 24 часов)
  if (diffInHours < 24 && messageDate.getDate() === now.getDate()) {
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  // Вчера (от 24 до 48 часов И предыдущий день)
  if (
    (diffInHours >= 24 && diffInHours < 48) ||
    (diffInDays === 1 && now.getDate() !== messageDate.getDate())
  ) {
    return 'Вчера';
  }

  // Последние 7 дней
  if (diffInDays < 7) {
    return daysOfWeek[messageDate.getDay()];
  }

  // Более недели назад
  const day = messageDate.getDate();
  const month = months[messageDate.getMonth()];
  const year = diffInDays > 365 ? ` ${messageDate.getFullYear()} года` : '';

  return `${day} ${month}${year}`;
};

function getRussianNoun(
  number: number,
  one: string,
  two: string,
  five: string,
) {
  let n = Math.abs(number) % 100;
  if (n >= 5 && n <= 20) return five;
  n = n % 10;
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return two;
  return five;
}


