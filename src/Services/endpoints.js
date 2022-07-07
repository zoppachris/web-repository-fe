const endPoints = {
  auth: {
    login: {
      method: "post",
      url: "/api/login",
    },
    changePassword: {
      method: "put",
      url: "/api/change-password",
    },
  },
  home: {
    getHomeData: {
      method: "get",
      url: "/api/homepage",
    },
  },
  faculty: {
    getFaculty: {
      method: "get",
      url: "/api/faculties",
    },
    createFaculty: {
      method: "post",
      url: "/api/faculties",
    },
    updateFaculty: {
      method: "put",
      url: "/api/faculties/:id",
    },
    deleteFaculty: {
      method: "delete",
      url: "/api/faculties/:id",
    },
  },
  major: {
    getMajor: {
      method: "get",
      url: "/api/majors",
    },
    createMajor: {
      method: "post",
      url: "/api/majors",
    },
    updateMajor: {
      method: "put",
      url: "/api/majors/:id",
    },
    deleteMajor: {
      method: "delete",
      url: "/api/majors/:id",
    },
  },
  lecture: {
    getLecture: {
      method: "get",
      url: "/api/lecturers",
    },
    createLecture: {
      method: "post",
      url: "/api/lecturers",
    },
    updateLecture: {
      method: "put",
      url: "/api/lecturers/:id",
    },
    deleteLecture: {
      method: "delete",
      url: "/api/lecturers/:id",
    },
  },
  student: {
    getStudent: {
      method: "get",
      url: "/api/students",
    },
    createStudent: {
      method: "post",
      url: "/api/students",
    },
    updateStudent: {
      method: "put",
      url: "/api/students/:id",
    },
    deleteStudent: {
      method: "delete",
      url: "/api/students/:id",
    },
  },
  admin: {
    getAdmin: {
      method: "get",
      url: "/api/users",
    },
    createAdmin: {
      method: "post",
      url: "/api/users",
    },
    updateAdmin: {
      method: "put",
      url: "/api/users/:id",
    },
    deleteAdmin: {
      method: "delete",
      url: "/api/users/:id",
    },
  },
  theses: {
    getTheses: {
      method: "get",
      url: "/api/theses",
    },
    createTheses: {
      method: "post",
      url: "/api/theses",
    },
    updateTheses: {
      method: "put",
      url: "/api/theses/:id",
    },
    deleteTheses: {
      method: "delete",
      url: "/api/theses/:id",
    },
    uploadFile: {
      method: "put",
      url: "/api/upload",
    },
  },
};

export default endPoints;
