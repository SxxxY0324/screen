package com.jwsxy.screenback.repository;

import com.jwsxy.screenback.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 员工数据访问接口
 * 继承JpaRepository提供基本的CRUD操作
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

    /**
     * 根据账号查找员工
     * @param account 账号
     * @return 员工实体（可选）
     */
    Optional<Employee> findByAccount(String account);

    /**
     * 根据账号和密码查找员工（用于登录验证）
     * @param account 账号
     * @param password 密码
     * @return 员工实体（可选）
     */
    Optional<Employee> findByAccountAndPassword(String account, String password);

    /**
     * 检查账号是否已存在
     * @param account 账号
     * @return 是否存在
     */
    boolean existsByAccount(String account);

    /**
     * 根据员工姓名查找员工（模糊查询）
     * @param fullName 员工姓名
     * @return 员工列表
     */
    List<Employee> findByFullNameContaining(String fullName);

    /**
     * 根据部门ID查找员工
     * @param departmentId 部门ID
     * @return 员工列表
     */
    List<Employee> findByDepartmentId(String departmentId);

    /**
     * 根据公司ID查找员工
     * @param companyId 公司ID
     * @return 员工列表
     */
    List<Employee> findByCompanyId(String companyId);

    /**
     * 根据角色ID查找员工
     * @param roleId 角色ID
     * @return 员工列表
     */
    List<Employee> findByRoleId(String roleId);

    /**
     * 查找允许登录的员工
     * @return 允许登录的员工列表
     */
    @Query("SELECT e FROM Employee e WHERE e.allowLogin = 1")
    List<Employee> findAllowLoginEmployees();

    /**
     * 查找在职的员工
     * @return 在职员工列表
     */
    @Query("SELECT e FROM Employee e WHERE e.isDimission = 0 OR e.isDimission IS NULL")
    List<Employee> findActiveEmployees();

    /**
     * 查找允许登录且在职的员工
     * @return 可用于登录的员工列表
     */
    @Query("SELECT e FROM Employee e WHERE (e.allowLogin = 1) AND (e.isDimission = 0 OR e.isDimission IS NULL)")
    List<Employee> findLoginableEmployees();

    /**
     * 根据账号查找允许登录且在职的员工（用于登录验证）
     * @param account 账号
     * @return 员工实体（可选）
     */
    @Query("SELECT e FROM Employee e WHERE e.account = :account AND (e.allowLogin = 1) AND (e.isDimission = 0 OR e.isDimission IS NULL)")
    Optional<Employee> findLoginableEmployeeByAccount(@Param("account") String account);

    /**
     * 根据手机号查找员工
     * @param phone 手机号
     * @return 员工实体（可选）
     */
    Optional<Employee> findByPhone(String phone);

    /**
     * 根据身份证号查找员工
     * @param idNumber 身份证号
     * @return 员工实体（可选）
     */
    Optional<Employee> findByIdNumber(String idNumber);

    /**
     * 根据岗位查找员工
     * @param workType 岗位
     * @return 员工列表
     */
    List<Employee> findByWorkType(String workType);

    /**
     * 查找指定公司的在职员工数量
     * @param companyId 公司ID
     * @return 在职员工数量
     */
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.companyId = :companyId AND (e.isDimission = 0 OR e.isDimission IS NULL)")
    long countActiveEmployeesByCompany(@Param("companyId") String companyId);

    /**
     * 查找指定部门的在职员工数量
     * @param departmentId 部门ID
     * @return 在职员工数量
     */
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.departmentId = :departmentId AND (e.isDimission = 0 OR e.isDimission IS NULL)")
    long countActiveEmployeesByDepartment(@Param("departmentId") String departmentId);

    /**
     * 根据账号和员工状态查找员工（用于登录时的详细验证）
     * @param account 账号
     * @return 员工实体（可选）
     */
    @Query("SELECT e FROM Employee e WHERE e.account = :account")
    Optional<Employee> findByAccountForLogin(@Param("account") String account);

    /**
     * 查找所有有效的管理员（根据角色名称）
     * @return 管理员列表
     */
    @Query("SELECT e FROM Employee e WHERE e.roleName LIKE '%管理员%' AND (e.allowLogin = 1) AND (e.isDimission = 0 OR e.isDimission IS NULL)")
    List<Employee> findActiveAdministrators();

    /**
     * 根据多个条件模糊搜索员工
     * @param keyword 搜索关键词（可匹配姓名、账号、手机号）
     * @return 员工列表
     */
    @Query("SELECT e FROM Employee e WHERE " +
           "(e.fullName LIKE %:keyword% OR e.account LIKE %:keyword% OR e.phone LIKE %:keyword%) " +
           "AND (e.isDimission = 0 OR e.isDimission IS NULL)")
    List<Employee> searchActiveEmployees(@Param("keyword") String keyword);

    /**
     * 批量查找员工（根据员工ID列表）
     * @param employeeIds 员工ID列表
     * @return 员工列表
     */
    @Query("SELECT e FROM Employee e WHERE e.employeeId IN :employeeIds")
    List<Employee> findByEmployeeIds(@Param("employeeIds") List<String> employeeIds);
} 