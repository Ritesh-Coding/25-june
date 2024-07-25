# employees/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Leaves
from .models import EmployeeLeaveAssignment
from rest_framework import generics, permissions,status,viewsets
from rest_framework.response import Response
from datetime import date
from authApp.models import Employee
#created By Ritesh
class EmployeeLeaveSerializer(serializers.ModelSerializer):
    total_approved_leaves = serializers.SerializerMethodField()
    # remaining_all_leaves =  serializers.SerializerMethodField()
     

    class Meta:
        model= Leaves
        fields = ['id','date','type','status','reason','leave_day_type','total_approved_leaves']   
        read_only_fields = ["status"]
    
        
    def validate(self, data):
         request = self.context['request']
         user = request.user
         data['employee_id_id'] = self.context['request'].user.id   
         
         if 'type' in data:             
                leave_type = data['type']
                checkRemainingLeaves = EmployeeLeaveAssignment.objects.filter(employee_id=user).first()
                # print("These is my total Paid Leaves that are Approved",checkRemainingLeaves,checkCasualLeaves)
                checkPaidLeaves = checkRemainingLeaves.remaining_paid_leave  
                checkCasualLeaves = checkRemainingLeaves.remaining_casual_leave
                checkSickLeaves = checkRemainingLeaves.remaining_sick_leave
                checkUnpaidLeaves = checkRemainingLeaves.remaining_unpaid_leave
                print(checkPaidLeaves,"-------",checkCasualLeaves,"------",checkSickLeaves)

                if leave_type == "PL":
                    if checkPaidLeaves <= 0:
                        raise serializers.ValidationError("Cannot applied as Paid Leaves are over")
                        
                if leave_type == "CL":
                    if checkCasualLeaves <= 0:
                        raise serializers.ValidationError("Cannot applied as Casual Leaves are over") 
                       
                if leave_type == "SL":
                    if checkSickLeaves <= 0:
                        raise serializers.ValidationError("Cannot applied as Sick Leaves are over") 
                     
                if leave_type == "UL":
                    if checkUnpaidLeaves <= 0:
                        raise serializers.ValidationError("Cannot applied as Sick Leaves are over")            
                
         if 'date' in data:
            leave_date = data['date']                
     
                       
            if leave_date <= date.today():                  
                   raise serializers.ValidationError("Error : Date must be future")                    
                
            if request.method == 'POST':
                if Leaves.objects.filter(date=leave_date, status="Pending", employee_id=user).exists():
                    raise serializers.ValidationError("Leave Day is already applied. Kindly wait for the approval")
                if Leaves.objects.filter(date=leave_date, status="Approved", employee_id=user).exists():
                    raise serializers.ValidationError("Leave Day is already approved for the same day. Kindly delete the existing leave")

            
            if request.method == 'PUT':
                leave_id = self.instance.id
                if Leaves.objects.filter(date=leave_date, status="Pending", employee_id=user).exclude(id=leave_id).exists():
                    raise serializers.ValidationError("Leave Day is already applied. Kindly wait for the approval")
                if Leaves.objects.filter(date=leave_date, status="Approved", employee_id=user).exclude(id=leave_id).exists():
                    raise serializers.ValidationError("Leave Day is already approved for the same day. Kindly delete the existing leave")

         return super().validate(data)
    def get_total_approved_leaves(self,obj):
        checkTotalLeaves = Leaves.objects.filter(employee_id = self.context['request'].user,status="Approved").count()
        return checkTotalLeaves
    # def get_remaining_all_leaves(self,obj):
    #     checkAllLeaves = EmployeeLeaveAssignment.objects.filter(employee_id = self.context['request'].user).values('remaining_paid_leave','remaining_unpaid_leave','remaining_sick_leave','remaining_casual_leave')
    #     return checkAllLeaves
   

class AssignedLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeLeaveAssignment
        fields = ['id','remaining_paid_leave','remaining_unpaid_leave','remaining_sick_leave','remaining_casual_leave']
#created By Ritesh   
class AdminLeaveUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model= Leaves
        fields = ["status"]

    def validate(self, data):
         
         data['employee_id_id'] = self.context['request'].user.id         
      
         return super().validate(data)
         
    def update(self, instance, validated_data):        
        data = validated_data
        id = instance.id  
        employeeId=instance.employee_id_id
       
        user = self.context['request'].user        
        try: 
            new_status = data["status"] 
        except Exception as e:
             return serializers.ValidationError({"Please provide status"})  
        print("thjis is my main tABLE ID",user.id)
        checkRemainingLeaves = EmployeeLeaveAssignment.objects.filter(employee_id_id=employeeId).first()
        
        print(checkRemainingLeaves,"*****************************************")
                # print("These is my total Paid Leaves that are Approved",checkRemainingLeaves,checkCasualLeaves)
        checkPaidLeaves = checkRemainingLeaves.remaining_paid_leave  
        checkCasualLeaves = checkRemainingLeaves.remaining_casual_leave
        checkSickLeaves = checkRemainingLeaves.remaining_sick_leave
        checkUnpaidLeaves = checkRemainingLeaves.remaining_unpaid_leave
        print(checkPaidLeaves,"-------",checkCasualLeaves,"------",checkSickLeaves,"------",checkUnpaidLeaves) 

        if new_status == "Approved":
                checkStatus = Leaves.objects.filter(id=id).values()       
                if checkStatus[0]["type"]=="PL":        
                    if checkPaidLeaves>0:
                        instance.status = validated_data.get('status', new_status)  
                        print("here1")
                        updatePaidLeaves = checkPaidLeaves -1
                        print("here2")
                        print("this is the ...............................",updatePaidLeaves)
                        updatePL=  EmployeeLeaveAssignment.objects.filter(employee_id_id=employeeId).update(remaining_paid_leave=updatePaidLeaves)
                        print(updatePL,"?????????????????")
                        instance.save()
                        return instance 
                    else:
                        raise serializers.ValidationError({"cannot Approve as Paid Leaves are over"})
                   
                elif checkStatus[0]["type"]=="CL":  
                    if checkCasualLeaves>0 :                
                        instance.status = validated_data.get('status', new_status)    
                        updateCasualLeaves = checkCasualLeaves -1
                        EmployeeLeaveAssignment.objects.filter(employee_id_id=employeeId).update(remaining_casual_leave=updateCasualLeaves)                  
                        instance.save()
                        return instance
                    else:
                        raise serializers.ValidationError({"Cannot be Applied as Casual Leaves are Over"})
                elif checkStatus[0]["type"]=="SL":  
                    if checkSickLeaves > 0 :                
                        instance.status = validated_data.get('status', new_status)  
                        updateSickLeaves = checkCasualLeaves -1
                        EmployeeLeaveAssignment.objects.filter(employee_id_id=employeeId).update(remaining_sick_leave=updateSickLeaves)                          
                        instance.save()
                        return instance
                    else:
                        raise serializers.ValidationError({"Cannot be Applied as Sick Leaves are Over"})
                    
                elif checkStatus[0]["type"]=="UL":  
                    if checkUnpaidLeaves > 0:                
                        instance.status = validated_data.get('status', new_status)                    
                        updateUnpaidLeaves = checkUnpaidLeaves -1
                        print("tHIS IS MY UNPAID Leave",updateUnpaidLeaves)
                        EmployeeLeaveAssignment.objects.filter(employee_id_id=employeeId).update(remaining_unpaid_leave=updateUnpaidLeaves)                          
                        instance.save()
                        return instance
                    else:
                        raise serializers.ValidationError({"Cannot be Applied as Sick Leaves are Over"})
                else:
                    raise serializers.ValidationError({"message: Cannot be Approved since you have utilized all the leaves"},status=status.HTTP_400_BAD_REQUEST)
        elif new_status == "Rejected":
                instance.status = validated_data.get('status', new_status)                    
                instance.save()
                return instance
          
        else:    
            raise serializers.ValidationError({"message: Improper Request type"}) 
#created By Ritesh    
class AdminLeaveSerializer(serializers.ModelSerializer):    
    status = serializers.CharField()
    employeeDetails = serializers.SerializerMethodField()
    class Meta:
        model= Leaves
        fields = ['id','employee_id','status','date','type','status','reason','leave_day_type','employeeDetails']
    def get_employeeDetails(self,obj):
        employeeDetails = Employee.objects.filter(id = obj.employee_id_id).values("first_name","last_name")        
        return employeeDetails
    

  
    

   
            




