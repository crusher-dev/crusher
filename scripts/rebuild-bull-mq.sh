BULLMQ_PACKAGE="node_modules/bullmq"

if [ -d "$BULLMQ_PACKAGE" ]; then
  cd $BULLMQ_PACKAGE
  echo "Starting building bullmq package again"
  yarn
  cd ../../
  echo "Finished with rebuilding bullmq package"
fi
