import type { NextPage } from "next";
import NextError from "next/error";

import {
  DailyAvgBlobGasPriceChart,
  DailyBlobFeeChart,
  DailyBlobGasUsedChart,
  DailyBlobGasComparisonChart,
  DailyBlocksChart,
  DailyAvgBlobFeeChart,
} from "~/components/Charts/Block";
import { StatsLayout } from "~/components/Layouts/StatsLayout";
import { api } from "~/api-client";
import { calculatePercentage, formatWei, parseAmountWithUnit } from "~/utils";

const BlockStats: NextPage = function () {
  const { data: dailyBlockStats, error: dailyBlockErr } =
    api.stats.getBlockDailyStats.useQuery({
      timeFrame: "30d",
    });
  const { data: overallBlockStats, error: overallBlockStatsErr } =
    api.stats.getBlockOverallStats.useQuery();

  const error = dailyBlockErr || overallBlockStatsErr;

  if (error) {
    return (
      <NextError
        title={error.message}
        statusCode={error.data?.httpStatus ?? 500}
      />
    );
  }

  console.log(
    overallBlockStats ? formatWei(overallBlockStats.avgBlobGasPrice) : undefined
  );

  return (
    <>
      <StatsLayout
        header="Block Stats"
        metrics={[
          {
            name: "Total Blocks",
            metric: {
              value: overallBlockStats?.totalBlocks,
            },
          },
          {
            name: "Total Blob Gas Used",
            metric: {
              value: overallBlockStats?.totalBlobGasUsed,
            },
          },
          {
            name: "Total Blob Fees",
            metric: {
              value: overallBlockStats?.totalBlobFee,
            },
          },
          {
            name: "Avg. Blob Gas Price",
            metric: overallBlockStats
              ? {
                  ...parseAmountWithUnit(
                    formatWei(overallBlockStats.avgBlobGasPrice)
                  ),
                  numberFormatOpts: {
                    maximumFractionDigits: 9,
                  },
                }
              : undefined,
          },
          {
            name: "Total Tx Fees Saved",
            metric: overallBlockStats
              ? {
                  ...parseAmountWithUnit(
                    formatWei(
                      overallBlockStats.totalBlobAsCalldataFee -
                        overallBlockStats.totalBlobFee
                    )
                  ),
                }
              : undefined,
            secondaryMetric: overallBlockStats
              ? {
                  value: calculatePercentage(
                    overallBlockStats.totalBlobFee,
                    overallBlockStats.totalBlobAsCalldataFee,
                    { returnComplement: true }
                  ),
                  unit: "%",
                }
              : undefined,
          },
          {
            name: "Total Gas Saved",
            metric: {
              value: overallBlockStats
                ? overallBlockStats.totalBlobAsCalldataGasUsed -
                  overallBlockStats.totalBlobGasUsed
                : undefined,
            },
            secondaryMetric:
              overallBlockStats &&
              overallBlockStats.totalBlobAsCalldataFee > BigInt(0)
                ? {
                    value: calculatePercentage(
                      overallBlockStats.totalBlobGasUsed,
                      overallBlockStats.totalBlobAsCalldataGasUsed,
                      { returnComplement: true }
                    ),
                    unit: "%",
                  }
                : undefined,
          },
        ]}
        charts={[
          <DailyBlocksChart
            key={0}
            days={dailyBlockStats?.days}
            blocks={dailyBlockStats?.totalBlocks}
          />,
          <DailyBlobGasUsedChart
            key={1}
            days={dailyBlockStats?.days}
            blobGasUsed={dailyBlockStats?.totalBlobGasUsed}
          />,
          <DailyBlobGasComparisonChart
            key={2}
            days={dailyBlockStats?.days}
            blobGasUsed={dailyBlockStats?.totalBlobGasUsed}
            blobAsCalldataGasUsed={dailyBlockStats?.totalBlobAsCalldataGasUsed}
          />,
          <DailyBlobFeeChart
            key={3}
            days={dailyBlockStats?.days}
            blobFees={dailyBlockStats?.totalBlobFees}
          />,
          <DailyAvgBlobFeeChart
            key={4}
            days={dailyBlockStats?.days}
            avgBlobFees={dailyBlockStats?.avgBlobFees}
          />,
          <DailyAvgBlobGasPriceChart
            key={5}
            days={dailyBlockStats?.days}
            avgBlobGasPrices={dailyBlockStats?.avgBlobGasPrices}
          />,
        ]}
      />
    </>
  );
};

export default BlockStats;
