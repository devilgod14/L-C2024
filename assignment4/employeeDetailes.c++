#include <string>
using namespace std;

class Employee {
    int id;
    string name;
    string department;
    bool working;
public:
    Employee(int id, const string &name, const string &department, bool working)
        : id(id), name(name), department(department), working(working) {}

    void terminateEmployee() {
        working = false;
    }

    bool isWorking() const {
        return working;
    }

    int getId() const { return id; }
    string getName() const { return name; }
    string getDepartment() const { return department; }
};

class EmployeeRepository {
public:
    void saveEmployeeToDatabase(const Employee &emp) {
    }
};

class EmployeeReport {
public:
    void printEmployeeDetailReportXML(const Employee &emp) {
    }
    
    void printEmployeeDetailReportCSV(const Employee &emp) {
    }
};
