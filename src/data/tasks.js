
export const tasks = [
  {
    id: 1,
    title: "Обновить пост-знакомство",
    status: "В процессе",
    progress: 45,
    completed: 8,
    total: 12,
    notCompleted: 4,
    deadline: "2024-12-20T14:45:00Z",
    created: "2024-12-13T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Скрин выложенного поста",
    curators: [
      { 
        id: 1, 
        name: "Анна Петрова", 
        initials: "АП", 
        color: "#f39c12",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-15T10:30:00Z"
      },
      { 
        id: 2, 
        name: "Михаил Сидоров", 
        initials: "МС", 
        color: "#10B981",
        type: "ЛК",
        status: "completed_late",
        completedAt: "2024-12-16T14:45:00Z"
      },
            { 
        id: 1, 
        name: "Анна Петрова", 
        initials: "АП", 
        color: "#f39c12",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-15T10:30:00Z"
      },
            { 
        id: 1, 
        name: "Анна Петрова", 
        initials: "АП", 
        color: "#f39c12",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-15T10:30:00Z"
      },
            { 
        id: 1, 
        name: "Анна Петрова", 
        initials: "АП", 
        color: "#f39c12",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-15T10:30:00Z"
      },
            { 
        id: 1, 
        name: "Анна Петрова", 
        initials: "АП", 
        color: "#f39c12",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-15T10:30:00Z"
      },
      { 
        id: 3, 
        name: "Елена Козлова", 
        initials: "ЕК", 
        color: "#F59E0B",
        type: "СК",
        status: "not_completed",
        completedAt: null
      }
    ]
  },
  {
    id: 2,
    title: "Отчет по знакомствам",
    status: "Завершено",
    progress: 100,
    completed: 20,
    total: 20,
    notCompleted: 0,
    deadline: "2024-12-18T10:30:00Z",
    created: "2024-12-10T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Сообщение",
    curators: [
      { 
        id: 4, 
        name: "Дмитрий Иванов", 
        initials: "ДИ", 
        color: "#EF4444",
        type: "ЛК",
        status: "completed",
        completedAt: "2024-12-17T09:15:00Z"
      },
      { 
        id: 5, 
        name: "Ольга Смирнова", 
        initials: "ОС", 
        color: "#8B5CF6",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-16T16:20:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Пост, сторис",
    status: "В процессе",
    progress: 23,
    completed: 5,
    total: 25,
    notCompleted: 20,
    deadline: "2024-12-25T10:30:00Z",
    created: "2024-12-23T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Скрин поста",
    curators: [
      { 
        id: 6, 
        name: "Александр Попов", 
        initials: "АП", 
        color: "#06B6D4",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-14T11:30:00Z"
      },
      { 
        id: 7, 
        name: "Наталья Волкова", 
        initials: "НВ", 
        color: "#84CC16",
        type: "ЛК",
        status: "not_completed",
        completedAt: null
      }
    ]
  },
  {
    id: 4,
    title: "Выходные",
    status: "В процессе",
    progress: 56,
    completed: 12,
    total: 18,
    notCompleted: 6,
    deadline: "2024-12-22T10:30:00Z",
    created: "2024-12-10T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Ответ боту",
    curators: [
      { 
        id: 8, 
        name: "Сергей Козлов", 
        initials: "СК", 
        color: "#F97316",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-13T08:45:00Z"
      },
      { 
        id: 9, 
        name: "Ирина Морозова", 
        initials: "ИМ", 
        color: "#EC4899",
        type: "ЛК",
        status: "completed_late",
        completedAt: "2024-12-19T15:30:00Z"
      }
    ]
  },
  {
    id: 5,
    title: "Поднятие игноров",
    status: "Не начато",
    progress: 0,
    completed: 0,
    total: 15,
    notCompleted: 15,
    deadline: "2024-12-30T10:30:00Z",
    created: "2024-12-23T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Скрин листа Ученики",
    curators: [
      { 
        id: 10, 
        name: "Максим Орлов", 
        initials: "МО", 
        color: "#6366F1",
        type: "СК",
        status: "not_completed",
        completedAt: null
      },
      { 
        id: 11, 
        name: "Татьяна Белова", 
        initials: "ТБ", 
        color: "#059669",
        type: "ЛК",
        status: "not_completed",
        completedAt: null
      }
    ]
  },
  {
    id: 6,
    title: "Заполнение рабочей таблицы",
    status: "В процессе",
    progress: 67,
    completed: 20,
    total: 28,
    notCompleted: 8,
    deadline: "2024-12-28T10:30:00Z",
    created: "2024-12-10T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Скрин таблицы",
    curators: [
      { 
        id: 12, 
        name: "Андрей Лебедев", 
        initials: "АЛ", 
        color: "#DC2626",
        type: "ЛК",
        status: "completed",
        completedAt: "2024-12-12T13:15:00Z"
      },
      { 
        id: 13, 
        name: "Светлана Новикова", 
        initials: "СН", 
        color: "#7C3AED",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-11T10:00:00Z"
      }
    ]
  },
  {
    id: 7,
    title: "Регистрация в боте",
    status: "Завершено",
    progress: 100,
    completed: 26,
    total: 26,
    notCompleted: 0,
    deadline: "2024-12-15T10:30:00Z",
    created: "2024-12-10T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Скрин завершения регистрации",
    curators: [
      { 
        id: 14, 
        name: "Павел Соколов", 
        initials: "ПС", 
        color: "#0891B2",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-10T14:30:00Z"
      },
      { 
        id: 15, 
        name: "Марина Федорова", 
        initials: "МФ", 
        color: "#65A30D",
        type: "ЛК",
        status: "completed",
        completedAt: "2024-12-09T16:45:00Z"
      }
    ]
  },
  {
    id: 8,
    title: "Трекинг успеваемости",
    status: "Не начато",
    progress: 0,
    completed: 0,
    total: 22,
    notCompleted: 22,
    deadline: "2025-01-15T10:30:00Z",
    created: "2024-12-23T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Объединить 3 скрина проведения трекинга",
    curators: [
      { 
        id: 16, 
        name: "Игорь Васильев", 
        initials: "ИВ", 
        color: "#EA580C",
        type: "ЛК",
        status: "not_completed",
        completedAt: null
      },
      { 
        id: 17, 
        name: "Юлия Зайцева", 
        initials: "ЮЗ", 
        color: "#DB2777",
        type: "СК",
        status: "not_completed",
        completedAt: null
      }
    ]
  },
  {
    id: 9,
    title: "Обновить резервки",
    status: "В процессе",
    progress: 41,
    completed: 9,
    total: 16,
    notCompleted: 7,
    deadline: "2024-12-26T10:30:00Z",
    created: "2024-12-23T10:30:00Z",
    description: "Ляляля, такое вот тут описание, такое вот оно большое, и вот еще чуть-чуть для более подробного описания задачи кураторам",
    report: "Скрин диалога с ботом",
    curators: [
      { 
        id: 18, 
        name: "Роман Медведев", 
        initials: "РМ", 
        color: "#4F46E5",
        type: "СК",
        status: "completed",
        completedAt: "2024-12-08T12:20:00Z"
      },
      { 
        id: 19, 
        name: "Екатерина Романова", 
        initials: "ЕР", 
        color: "#047857",
        type: "ЛК",
        status: "not_completed",
        completedAt: null
      }
    ]
  }
];

export const stats = {
  total: 9,
  completed: 2,
  inProgress: 5,
  notStarted: 2,
  averageProgress: 48
};
