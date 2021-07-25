#! /bin/bash
set -e

profile=$1
region='us-west-1'
service='gopher-holes-cognito'
stage='dev'
file_path="../../temp.yml"

function sls_deploy() {
    sls deploy -v --stage $stage --aws-profile $profile
}

function setup_cognito_triggers() {
    user_pool_id=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolId\`].Value" --no-paginate --output text --region $region --profile $profile)

    account_id=$(aws sts get-caller-identity --output text --query 'Account' --profile $profile)

    lambda_trigger_arn='arn:aws:lambda:'$region':'$account_id':function:'$service'-'$stage'-cognitoEventTriggers'

    # set user pool 
    aws cognito-idp update-user-pool \
            --user-pool-id $user_pool_id \
            --lambda-config '{
                    "PreSignUp": "'$lambda_trigger_arn'"
            }' \
            --region $region \
            --profile $profile

}

function write_cognito_temp_file() {
    # check if file exists
    if [ -f $file_path ]
    then
        echo "File exists"
        rm $file_path
    fi

    # Grab export (good for handling multiple stacks)
    COGNITO_USER_POOL_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolId\`].Value" --no-paginate --output text --region $region --profile $profile)
    COGNITO_CLIENT_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:CognitoUserPoolClientWeb\`].Value" --no-paginate --output text --region $region --profile $profile)
    COGNITO_ARN=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolArn\`].Value" --no-paginate --output text --region $region --profile $profile)

    # Create the temp file
    echo "COGNITO_USER_POOL_ID: ${COGNITO_USER_POOL_ID}" >> $file_path
    echo "COGNITO_CLIENT_ID: ${COGNITO_CLIENT_ID}" >> $file_path
    echo "COGNITO_ARN: ${COGNITO_ARN}" >> $file_path
}

# write cognito temp file for purposely using on gopher holes API
sls_deploy
setup_cognito_triggers
write_cognito_temp_file
