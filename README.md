# How to Use the AWS Cloud9 IDE to Set Up the Amazon SNS in AWS Lambda Function Sample

**Step 1: Create an AWS CloudFormation stack based on the associated template.**

This stack creates the Amazon SNS topic and 
subscription, as well as the execution role that allows the AWS Lambda function 
to publish to the topic. 

1. In the AWS Cloud9 IDE, open the terminal. 
2. Set the AWS Region to run the stack in. This AWS Region must be the same one
   as the AWS Lambda function. To do this, use the AWS Command Line Interface 
   (AWS CLI) to run the following command.

   ```
   aws configure
   ```
   
   * Accept the default values for **AWS Access Key ID** and 
     **AWS Secret Access Key** by pressing **Enter** twice. 
   * For **Default region name**, type the desired AWS Region ID 
     (for example, **us-east-2**), and then press **Enter**.
   * For **Default output format**, type **json**, and then press **Enter**.

3. Switch to the directory that contains the 
   `sns-create-topic-subscription.yaml` file.
4. Use the AWS CLI to run the following command, which creates the stack in 
   AWS CloudFormation.

   ```
   aws cloudformation create-stack --template-body file://sns-create-topic-subscription.yaml --capabilities CAPABILITY_NAMED_IAM --parameters ParameterKey=SNSTopicName,ParameterValue=SNS_TOPIC_NAME ParameterKey=EmailAddress,ParameterValue=EMAIL_ADDRESS --stack-name STACK_NAME 
   ```
   
   In the preceding command, replace the following placeholders. 

   * Leave `CAPABILITY_NAMED_IAM` unchanged.
   * Replace `SNS_TOPIC_NAME` with whatever you want to name the 
     Amazon SNS topic.
   * Replace `EMAIL_ADDRESS` with the email address you want Amazon SNS 
     to send messages to.
   * Replace `STACK_NAME` with whatever you want to name the stack.

4. Do not proceed to Step 2 until the stack successfully completes. 
   To verify this, use the AWS CLI to run the following command, 
   which displays the stack's status.

   ```
   aws cloudformation describe-stacks --query 'Stacks[0].StackStatus' --output text --stack-name STACK_NAME 
   ```
   
   In the preceding command, replace `STACK_NAME` with whatever you 
   named the stack earlier.

   Do not proceed until the preceding command outputs **CREATE_COMPLETE**.
   (You might need to run this command multiple times to see 
   **CREATE_COMPLETE**.)

5. Check your inbox for an incoming email from **no-reply@sns.amazonaws.com**. 
   In this email choose the **Confirm subscription** link. You will not be able 
   to receive email from this Amazon SNS topic until you confirm the subscription.

**Step 2: Verify that Amazon SNS can successfully send messages to 
your email address.**

1. Use the AWS CLI to run the following command, which outputs the 
   Amazon Resource Name (ARN) of the Amazon SNS topic.

   ```
   aws cloudformation describe-stacks --query 'Stacks[0].Outputs[1].OutputValue' --output text --stack-name STACK_NAME 
   ```
   
   In the preceding command, replace `STACK_NAME` with whatever you named the stack earlier.

2. Use the AWS CLI to run the following command, which sends a message with the
   specified subject and message to your email address.

   ``` 
   aws sns publish --subject 'Hello from Amazon SNS' --message 'You just sent an email by using Amazon SNS.' --topic-arn TOPIC_ARN 
   ```
   
   In the preceding command, replace `TOPIC_ARN` with the ARN of the 
   Amazon SNS topic that was output earlier.
   
   Check your email to confirm that the message was successfully sent. 

**Step 3: Update the AWS Lambda function to use the execution role and to change 
the function timeout period.** 

If you try to run the function now, it won't work. This is because you need to 
update the function to use the execution role that AWS CloudFormation 
created, as well as to update the function's timeout period.

1. In the function's associated `template.yaml` file, 
   between the lines of code `Properties` and 
   `Handler: FUNCTION_NAME/index.handler`, add the following 
   line of code to specify the Amazon Resource Name (ARN) of the execution 
   role for the function to use.

        Properties:
           Role: arn:aws:iam::ACCOUNT_ID:role/LambdaSNSExecutionRole
           Handler: FUNCTION_NAME/index.handler

   In this code, replace `ACCOUNT_ID` with your AWS account ID.

2. At the end of the `template.yaml` file, extend the function's timeout 
   period by changing the `Timeout` value 
   from `15` to `60`, and then save the file.
3. Now that you've updated the function, you can test it. 
   See the function's code comments for a function input payload example.

**(Optional) Step 4: Delete the Amazon SNS topic and subscription as well as the 
AWS Lambda execution role.**

When you are done using this sample, you can delete the AWS CloudFormation 
stack, which deletes the Amazon SNS topic and subscription as well as the 
AWS Lambda execution role.

1. Use the AWS CLI to run the following command, which deletes the stack 
   from AWS CloudFormation.

   ```
   aws cloudformation delete-stack --stack-name STACK_NAME
   ```

   In the preceding command, replace `STACK_NAME` with whatever you named 
   the stack earlier.
   
2. To verify that the stack is deleted, use the AWS CLI to run 
   the following command.

   ```
   aws cloudformation describe-stacks --query 'Stacks[0].StackStatus' --output text --stack-name STACK_NAME 
   ```
   
   In the preceding command, replace `STACK_NAME` with whatever you named 
   the stack earlier.
   
   Keep running this command until the output states that the stack no 
   longer exists.

**(Optional) Step 5: Delete the AWS Lambda function.**

When you are done using this sample, you can delete the function 
from AWS Lambda.

1. Use the AWS CLI to run the following command, which deletes the function 
   from AWS Lambda.

   ```
   aws lambda delete-function --function-name FUNCTION_NAME
   ```

   In the preceding command, replace `FUNCTION_NAME` with whatever you named 
   the function earlier.

2. To verify that the function is deleted, use the AWS CLI to run the 
   following command. 

   ```
   aws lambda list-functions
   ```
   
   The function should not be in the list of functions that are output.
   
**(Optional) Step 6: Reset the AWS Region that is used by the AWS CLI.**

If you want the AWS CLI to use a different AWS Region by default, be sure to 
run the following command to reset it. 

```
aws configure
```
   
* Accept the default values for **AWS Access Key ID** and 
  **AWS Secret Access Key** by pressing **Enter** twice. 
* For **Default region name**, type the desired AWS Region ID, 
  and then press **Enter**.
* Accept or change the **Default output format** as desired,
  and then press **Enter**.