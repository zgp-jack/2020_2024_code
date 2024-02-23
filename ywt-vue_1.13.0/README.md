<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-14 14:01:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-26 16:51:53
 * @Description: 
-->
Vue script 引入顺序规范

本模块文件
其他模块文件
公共模块文件
第三方模块文件
框架文件

事件处理方法命名规则
新增-onCreateXxx
修改-onUpdateXxx
删除-onDeleteXxx
查看-onViewXxx
提交-onSubmitXxx


版本管理规范
各开发分支进行开发，修复bug
主开发分支-develop,由管理员管理，各开发分支开发完成后合并到develop分支，并确定版本号
测试分支-test,由管理员管理，由develop分支开发完成后合并到test分支,
发布分支-master,由管理员管理，由test分支测试完成后合并到release分支 
