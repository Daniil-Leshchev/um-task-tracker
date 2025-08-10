
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
        completedAt: "2024-12-15T10:30:00Z",
        reportUrl: null,
        reportText: "Я все сделала!"
      },
      { 
        id: 2, 
        name: "Михаил Сидоров", 
        initials: "МС", 
        color: "#10B981",
        type: "ЛК",
        status: "completed_late",
        completedAt: "2024-12-16T14:45:00Z",
        reportUrl: null,
        reportText: "Я тоже все сделал!"
      },
      { 
        id: 3, 
        name: "Елена Козлова", 
        initials: "ЕК", 
        color: "#F59E0B",
        type: "СК",
        status: "not_completed",
        completedAt: null,
        reportUrl: null,
        reportText: null
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
        completedAt: "2024-12-17T09:15:00Z",
        reportUrl: null,
        reportText: "Я тоже все сделала!"
      },
      { 
        id: 5, 
        name: "Ольга Смирнова", 
        initials: "ОС", 
        color: "#8B5CF6",
        type: "СК",
        status: "not_completed",
        completedAt: null,
        reportUrl: null,
        reportText: null
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
        status: "not_completed",
        completedAt: null,
        reportUrl: null,
        reportText: null
      },
      { 
        id: 7, 
        name: "Наталья Волкова", 
        initials: "НВ", 
        color: "#84CC16",
        type: "ЛК",
        status: "not_completed",
        completedAt: null,
        reportUrl: null,
        reportText: null
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
        status: "not_completed",
        completedAt: null,
        reportUrl: null,
        reportText: null
      },
      { 
        id: 9, 
        name: "Ирина Морозова", 
        initials: "ИМ", 
        color: "#EC4899",
        type: "ЛК",
        status: "not_completed",
        completedAt: null,
        reportUrl: null,
        reportText: null
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
        completedAt: null,
        reportUrl: null,
        reportText: null
      },
      { 
        id: 11, 
        name: "Татьяна Белова", 
        initials: "ТБ", 
        color: "#059669",
        type: "ЛК",
        status: "not_completed",
        completedAt: null,
        reportUrl: null,
        reportText: null
      }
    ]
  },
];

export const stats = {
  total: 9,
  completed: 2,
  inProgress: 5,
  notStarted: 2,
  averageProgress: 48
};
